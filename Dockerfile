FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=RestaurantFoodPlanningSystem

RUN mkdir -p /var/opt/mssql/data

WORKDIR /var/opt/mssql

EXPOSE 1433

CMD [ "/opt/mssql/bin/sqlservr" ]