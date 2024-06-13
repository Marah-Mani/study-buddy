#!/bin/bash

# Function to display success messages
function success_message() {
    if [ $? -eq 0 ]; then
        echo "$1 succeeded."
    else
        echo "$1 failed." >&2
        exit 1
    fi
}

# Function to replace spaces with hyphens in the branch name
function sanitize_branch_name() {
    echo "$1" | tr ' ' '-'
}

# Open terminal and ask for branch name
read -p "Enter the branch name: " branch_name
sanitized_branch_name=$(sanitize_branch_name "$branch_name")

# Checkout to the branch
git checkout -b "$sanitized_branch_name"
success_message "Branch checkout done ."

# Add changes
git add .
success_message "Git add"

# Commit changes
git commit -m "$branch_name"
success_message "Git commit"

# Pull from development
git pull origin development
success_message "Git pull"

# Push to the branch
git push origin "$sanitized_branch_name"
success_message "Git push"

#-------------------------------------------------------------------------------------------------------------

# Create a pull request to the development branch
gh pr create --base development --head "$sanitized_branch_name" --title "PR from $sanitized_branch_name" --body "Automated PR from $sanitized_branch_name"
success_message "Pull request creation"

# Merge the pull request and delete the branch if the merge is successful
gh pr merge --auto --squash --delete-branch
success_message "Pull request merge and branch deletion"

git checkout development
success_message "Branch checkout to development"

# #-------------------------------------------------------------------------------------------------------------

# # Add changes
# git add .
# success_message "Git add"

# # Commit changes
# git commit -m "$branch_name"
# success_message "Git commit"

# # Pull from development
# git pull origin main
# success_message "Git pull main"

# # Push to the branch
# git push origin orign development
# success_message "Git push development"

# #-------------------------------------------------------------------------------------------------------------

# # Create a new pull request from development to main
# gh pr create --base main --head development --title "PR from development to main" --body "Automated PR from development to main"
# success_message "PR creation from development to main"

# # Merge the new pull request from development to main
# gh pr merge --auto --squash --delete-branch
# success_message "Merge PR from development to main"

# # Pull from main to development
# git checkout development
# success_message "Again back in development"

echo "All tasks completed successfully."
