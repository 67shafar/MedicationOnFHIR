FROM amazoncorretto:11

COPY ./target/backend-1.0-jar-with-dependencies.jar /tmp/backend.jar
WORKDIR /tmp

ENTRYPOINT java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8787 -jar backend.jar