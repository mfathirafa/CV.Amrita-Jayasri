#!/bin/sh
set -e

# Default PORT ke 80 jika tidak diset oleh platform
PORT=${PORT:-80}

# Update Apache port sesuai environment variable Render
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

echo "Starting deployment on port $PORT..."

# Jalankan cache optimization jika APP_KEY sudah diisi
if [ -n "$APP_KEY" ]; then
    echo "Caching configuration and routes..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Jalankan migrasi dan seeder otomatis jika terkoneksi ke database
if [ -n "$DB_HOST" ] || [ "$DB_CONNECTION" = "sqlite" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration skipped or failed"
    
    echo "Running database seeder..."
    php artisan db:seed --class=AdminSeeder --force || echo "Seeder skipped or failed"
fi

echo "Starting Apache web server..."
exec apache2-foreground
