# Use Java 21 runtime
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy JAR from target folder
COPY target/*.jar app.jar

# Expose the port your service runs on
EXPOSE 8082

# Command to run the JAR
ENTRYPOINT ["java","-jar","app.jar"]
