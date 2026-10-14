FROM php:8.2-apache

# Chain RUN commands to reduce image layers
RUN a2enmod rewrite \
    && docker-php-ext-install mysqli pdo pdo_mysql

WORKDIR /var/www/html

COPY . /var/www/html/

# Chain permissions
RUN chown -R www-data:www-data /var/www/html/asset/images \
    && chmod -R 755 /var/www/html/asset/images