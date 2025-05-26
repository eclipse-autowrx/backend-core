local http = require "resty.http"
local utils = require "kong.tools.utils"
local cjson = require "cjson"

local AuthHandler = {
  VERSION = "1.0.0",
  PRIORITY = 1000,
}

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
    body = utils.encode_args({
      permissionQuery = extract_permissions_string(conf),
      permissions = extract_permissions_string(conf), -- Include legacy permissions field
    }),
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

  if user_data.id then
    kong.service.request.set_header("X-User-Id", user_data.id)
  end

  if user_data.email then
    kong.service.request.set_header("X-User-Email", user_data.email)
  end

  return true
end

function AuthHandler:access(conf)
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
