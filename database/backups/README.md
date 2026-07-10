# EverTruck Database Backups (`/database/backups`)

This directory is dedicated to storing database backup scripts, automated snapshot workflows, and point-in-time recovery documentation for the EverTruck PostgreSQL database.

---

## Manual Backup Workflow

To create an immediate SQL dump of the running production or development PostgreSQL database without stopping containers:

### 1. Create a Timestamped SQL Dump
Run the following command from the project root:

```bash
docker compose exec -T postgres pg_dump -U evertruck -d evertruck_db --clean --if-exists > ./database/backups/evertruck_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Create a Compressed Binary Backup (Recommended for Large Databases)
```bash
docker compose exec -T postgres pg_dump -U evertruck -d evertruck_db -Fc > ./database/backups/evertruck_backup_$(date +%Y%m%d_%H%M%S).dump
```

---

## Restoration Workflow

To restore a database backup into a running PostgreSQL container:

> [!CAUTION]
> Restoring a backup will overwrite existing tables and data. Ensure you have a current backup before initiating a restore.

### Restoring from a Plain SQL Dump (`.sql`)
```bash
cat ./database/backups/your_backup_file.sql | docker compose exec -T postgres psql -U evertruck -d evertruck_db
```

### Restoring from a Custom Binary Dump (`.dump`)
```bash
docker compose exec -T postgres pg_restore -U evertruck -d evertruck_db --clean --if-exists /docker-entrypoint-initdb.d/../backups/your_backup_file.dump
```

---

## Automated VPS Production Cron Job

On your Ubuntu VPS, set up a daily automated backup via `cron`:

1. Open crontab editor:
   ```bash
   crontab -e
   ```
2. Add a daily job at 2:00 AM that keeps backups for 14 days:
   ```cron
   0 2 * * * cd /path/to/evertruck && docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U evertruck_prod -d evertruck_production_db -Fc > ./database/backups/backup_$(date +\%Y\%m\%d).dump && find ./database/backups -name "backup_*.dump" -mtime +14 -delete
   ```
