resource "aws_wafv2_web_acl" "api_rate_limit_acl" {
  name        = "api-rate-limit-acl"
  description = "Web ACL for rate limiting API calls"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "rate-limit-rule"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 250 # per 5 min
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      sampled_requests_enabled   = false
      metric_name                = "RateLimitingMetricRule"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    sampled_requests_enabled   = false
    metric_name                = "RateLimitingMetric"
  }
}

resource "aws_wafv2_web_acl_association" "api_rate_limit_acl_association" {
  web_acl_arn  = aws_wafv2_web_acl.api_rate_limit_acl.arn
  resource_arn = data.aws_lb.eb_env_lb.arn
}