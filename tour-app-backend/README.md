# Getting Started with Java Spring Boot 3 Backend

## Prerequisites

- Java JDK 17 or later
- Maven
- MySQL database server
- PayPal Developer Account (for PayPal API credentials)
- AWS Account (for AWS credentials)

## Database Configuration

Ensure your MySQL database server is running.

**Run the Database Setup Script:**
Before building the project, execute the database setup script to create and configure the necessary database and tables. The script can be found at db/01-tour-management-system-db-setup.sql.

## PayPal and AWS Setup

Before running the application, ensure you have:

Created a PayPal application in the PayPal Developer Portal to get the client ID and secret.
Configured your AWS credentials and created an S3 bucket, noting down the bucket name and region.

## Environment Variables

The application requires certain environment variables, which are specified in an application.properties file. Create your own application.properties file in the src/main/resources directory, based on the application.properties.example template provided.

## Building the Project

To clear the target directory, build the project, and package the resulting JAR file into the target directory, run:
`mvn clean package`

## Running the Application

To run the application, run:
`mvn spring-boot:run`
The application starts on http://localhost:8080 by default, but will use a different port if specified.
