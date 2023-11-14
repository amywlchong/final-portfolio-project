# final-portfolio-project

## Project Title and Description

### Tour Booking and Management App

This web application streamlines the process of booking and managing tours. It serves different user groups, including customers, tour guides, and administrators. Customers can explore and book tours, tour guides can manage their schedules, and administrators can perform key admin tasks.

## Deployed App

https://natours.club/

## Functionalities

### Frontend

- **Role-Based Access Control**: Customized access for different user roles based on business requirements.
- **General User Features**: User registration, login/logout, password updates, and browsing tours.
- **Customer-Specific Features**: Tour booking and payment, managing personal bookings, and reviewing tours.
- **Lead Tour Guides and Admin Features**: Tour guide schedule management, and comprehensive tour management.
- **Admin-Specific Features**: Dashboard access, user administration, and booking management.
- **Responsive Design**: Adapts to various screen sizes, including web, tablet, and mobile.

### Backend

- **REST API**:
  - Tour Management: Endpoints for tours and image handling.
  - Booking Management: Endpoints for handling tour bookings.
  - Payments: Endpoints facilitating payments, integrated with PayPal.
  - Review Management: Endpoints for user reviews on tours.
  - Schedule Management: Endpoints for tour guide scheduling.
  - User Authentication: Secure user registration, login, and verification.
  - User Administration: Management of user accounts.
  - Self-Service: Personal account management.
- **Security**:
  - Authentication: Utilization of JWT (JSON Web Token) for user authentication.
  - Role-Based Authorization: Access control for various user roles.
- **Order and Payment**:
  - Order Management: Handling the creation of orders.
  - Payment Processing: Processing payments through PayPal.

## Technologies Used and Skills Demonstrated

### Frontend

- TypeScript, React, React-Redux, Custom Hooks, Material-UI (MUI).

### Backend

- Core: Java and Spring Boot 3.
- Security: Spring Security 6 with JWT for authentication and authorization.
- Cloud Integration: AWS S3 for storage and management of tour images.
- Payment Processing: PayPal API integration.
- Advanced Programming: DTOs, custom JPQL queries, data validation, and exception handling.
- Database: MySQL.

### Deployment and Cloud Integration

- Containerization and Orchestration:
  - Docker: Employed Docker to containerize frontend, backend, and MySQL database.
  - Consistent Environments: Ensured consistency across various stages of development and deployment.
- AWS Services:
  - Image Storage: Leveraged AWS ECR for Docker image storage.
  - Serverless Deployment: Deployed applications using AWS ECS with Fargate for reduced management overhead.
  - Monitoring and Logging: Integrated AWS CloudWatch for real-time monitoring and logging.
- Load Balancing and Security:
  - Load Balancers: Configured AWS load balancers for both frontend and backend to ensure efficient traffic distribution.
  - Security Groups: Configured and implemented security groups for optimal security.
- Database Management:
  - Containerized Database: Deployed MySQL database in a containerized environment, ensuring scalable database management.
