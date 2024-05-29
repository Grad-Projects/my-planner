resource "aws_s3_bucket" "app" {
  bucket        = var.bucket_name
  force_destroy = true
  tags          = { Name = var.bucket_name }
}

resource "aws_s3_bucket_versioning" "source_versioning" {
  bucket = aws_s3_bucket.app.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket-policy" {
  bucket = aws_s3_bucket.app.bucket
  policy = data.aws_iam_policy_document.bucket-policy.json

  depends_on = [aws_s3_bucket_public_access_block.app]
}

resource "aws_s3_bucket_website_configuration" "app" {
  bucket = aws_s3_bucket.app.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "pages/404.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "app" {
  bucket = aws_s3_bucket.app.bucket

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = var.cors_allowed_origins
    max_age_seconds = 3000
  }
}