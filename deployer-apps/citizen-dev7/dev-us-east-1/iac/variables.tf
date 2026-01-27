############
# Required #
############

variable "eks_oidc_provider_url" {
  description = "The OIDC provider URL of the EKS cluster"
  type        = string
  nullable    = false
}

variable "user_environment_id" {
  description = "The unique identifier of the user environment"
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.user_environment_id))
    error_message = "User environment ID must be lowercase alphanumeric characters or hyphens"
  }
}

variable "pmck_instance_id" {
  description = "The PMcK instance ID"
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$", var.pmck_instance_id))
    error_message = "PMcK instance ID must be alphanumeric characters separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}

variable "product_id" {
  description = "Product ID is 5 digits number from Firm's Product Catalogue: https://mckinsey.service-now.com/products"
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^[0-9]{5}$", var.product_id))
    error_message = "Product ID must be a 5-digit number"
  }
}

variable "used_for" {
  description = "The purpose of the resources"
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^(non_prod|prod|sbx)$", var.used_for))
    error_message = "Valid value: `non_prod`, `prod`, `sbx`"
  }
}