# Create the Cognito User Pool
resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.naming_prefix}-user-pool"
  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  auto_verified_attributes = ["email"]
}

# Create the Cognito User Pool Client
resource "aws_cognito_user_pool_client" "client" {
  name                                 = "${var.naming_prefix}-user-pool-client"
  user_pool_id                         = aws_cognito_user_pool.user_pool.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"] # Use with PKCE (Does not require client secret)
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["http://localhost:5000/callback"]
  logout_urls                          = ["http://localhost:5000/logout"]
  supported_identity_providers         = ["COGNITO", "Google"]
  generate_secret                      = false # Public client cannot store the secret securely, so we won't use one
}

# Create the Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "user_pool_domain" {
  domain       = "my-planner"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

# Configure GitHub as an Identity Provider
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.client_id
    client_secret    = var.client_secret
    authorize_scopes = "email openid profile"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}