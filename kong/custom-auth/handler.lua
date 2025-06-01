local http = require "resty.http"
local utils = require "kong.tools.utils"
local cjson = require "cjson"

local AuthHandler = {
  VERSION = "1.0.0",
  PRIORITY = 1000,
}

local function sanitize_header(conf)
  kong.service.request.clear_header("X-User-Id")
  kong.service.request.clear_header("X-User-Email")
end

-- TODO: This function needs to include logic to extract permissions from the request
-- for different entities: models, prototypes, inventory/instances, inventory/schemas, assets, ...
-- For now, it is a placeholder.
local function extract_permissions_string(conf)
  return ""
end

-- Authenticate and authorize the user
local function auth_user(conf, authorization_header)
  local client = http.new()
  kong.log.info("Validating identity and permissions with custom auth service url: ", conf.url)
  local res, err = client:request_uri(conf.url, {
    method = "POST",
    ssl_verify = false,
    headers = {
      ["Authorization"] = authorization_header,
    },
  })

  if not res then
    kong.log.err("Failed to send request to custom auth service: ", err)
    return kong.response.exit(500)
  end
  if res.status == 403 then
    kong.log.err("User is not authorized: ", res.body)
    return kong.response.exit(403, { message = "Forbidden" })
  end
  if res.status ~= 200 then
    kong.log.err("Failed to authenticate user: ", res.body)
    return kong.response.exit(401, { message = "Please authenticate" })
  end

  local user_data
  pcall(function()
    user_data = cjson.decode(res.body)
  end)

  if not user_data then
    kong.log.err("Failed to decode user data from auth service response:", res.body)
    return kong.response.exit(500, { message = "Internal Server Error" })
  end

  if user_data.user then
    if user_data.user.id then
      kong.service.request.set_header("X-User-Id", user_data.user.id)
    end

    if user_data.user.email then
      kong.service.request.set_header("X-User-Email", user_data.user.email)
    end
  end

  return true
end

-- Handle CORS preflight OPTIONS request
local function handle_options_request()
  -- Get the Origin header
  local origin = kong.request.get_header("Origin")
  if not origin then
    kong.response.exit(403, { message = "Origin header is required" })
  end

  -- Strip the scheme for pattern matching (e.g., "https://playground.digital.auto" -> "playground.digital.auto")
  local origin_without_scheme = origin:match("^https?://(.+)$") or origin

  -- Get allowed origins from CORS_ORIGIN environment variable
  local cors_origin = "localhost:%d+,.*%.digitalauto%.tech,.*%.digitalauto%.asia,.*%.digital%.auto,https://digitalauto.netlify.app,127%.0%.0%.1:%d+"
  local origins = {}
  for pattern in cors_origin:gmatch("[^,]+") do
    table.insert(origins, pattern)
  end


  -- Check if the origin matches any allowed pattern
  local is_allowed = false
  for _, pattern in ipairs(origins) do
    if pattern:match("^https?://") then
      -- Exact match for patterns with scheme
      if origin == pattern then
        is_allowed = true
        break
      end
    else
      -- Lua pattern match for patterns without scheme
      if origin_without_scheme:match("^" .. pattern .. "$") then
        is_allowed = true
        break
      end
    end
  end

  -- If no match, reject the request
  if not is_allowed then
    kong.response.exit(403, { message = "Origin not allowed" })
  end

  -- Set CORS headers
  kong.response.set_header("Access-Control-Allow-Origin", origin)
  kong.response.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  kong.response.set_header("Access-Control-Allow-Headers", "Content-Type")
  kong.response.exit(204)
end

function AuthHandler:access(conf)
  if kong.request.get_method() == "OPTIONS" then
    return handle_options_request()
  end

  sanitize_header(conf)

  -- Check if the request path is in the public paths
  local path = kong.request.get_path()
  local protected_paths = conf.protected_paths or {}

  local required_auth = false

  for _, pattern in ipairs(protected_paths) do
    if path:match(pattern) then
      required_auth = true
      break
    end
  end

  if not required_auth then
    -- If the request path is not in the public paths, skip authentication
    return
  end

  -- Throw an error if no access_token in header
  local authorization_header = kong.request.get_headers()["Authorization"]
  if not authorization_header then
    return kong.response.exit(401, { message = "Please authenticate" })
  end

  auth_user(conf, authorization_header)
end

return AuthHandler
