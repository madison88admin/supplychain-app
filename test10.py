import os
import json
import requests
import sqlite3
from datetime import datetime
import sys

# Fix encoding issues
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

USERNAME = "lester"
PASSWORD = "Test@123456"
BASE_URL = "https://nextgen.madison88.com:8443"

DB_FILE = "supplychain_data.db"

ENDPOINT_CONFIGS = {

    #     "PurchaseOrder": {
    #     "path": "/api/PurchaseOrder",
    #     "data_key": "Items",
    #     "id_field": "ID"
    # },
    # "PurchaseOrderLines": {
    #     "path": "/api/PurchaseOrderLines",
    #     "data_key": "Items",
    #     "id_field": "PurchaseOrderLineID"
    # }
    "BillOfMaterialItemCategories": {"path": "/api/BillOfMaterialItemCategories", "data_key": "Items", "orderby": False},
    "BillOfMaterialItemCategoryMaterialTypes": {"path": "/api/BillOfMaterialItemCategoryMaterialTypes", "data_key": "Items", "orderby": False},
    "BillOfMaterialItems": {"path": "/api/BillOfMaterialItems", "data_key": "Items", "orderby": False},
    "Customers": {"path": "/api/Customers", "data_key": "Items", "orderby": False},
    "MaterialOptions": {"path": "/api/MaterialOptions", "data_key": "Items", "orderby": True},
    "Materials": {"path": "/api/Materials", "data_key": "Items", "orderby": True},
    "MaterialSupplierProfiles": {"path": "/api/MaterialSupplierProfiles", "data_key": "Items", "orderby": True},
    "MaterialSuppliers": {"path": "/api/MaterialSuppliers", "data_key": "Items", "orderby": False},
    "MaterialTypes": {"path": "/api/MaterialTypes", "data_key": "Items", "orderby": False},
    "ProductBillOfMaterials": {"path": "/api/ProductBillOfMaterials", "data_key": "Items", "orderby": True},
    "ProductOptions": {"path": "/api/ProductOptions", "data_key": "Items", "orderby": True},
    "Products": {"path": "/api/Products", "data_key": "Items", "orderby": True},
    "ProductStatuses": {"path": "/api/ProductStatuses", "data_key": "Items", "orderby": False},
    "ProductSupplierProfiles": {"path": "/api/ProductSupplierProfiles", "data_key": "Items", "orderby": True},
    "ProductSuppliers": {"path": "/api/ProductSuppliers", "data_key": "Items", "orderby": False},
    "ProductTypes": {"path": "/api/ProductTypes", "data_key": "Items", "orderby": False},
    "PurchaseOrder": {"path": "/api/PurchaseOrder", "data_key": "Items", "orderby": True},
    "PurchaseOrderLines": {"path": "/api/PurchaseOrderLines", "data_key": "Items", "orderby": True}
}

def sanitize_value(val):
    if isinstance(val, (dict, list)):
        return json.dumps(val)
    elif isinstance(val, datetime):
        return val.isoformat()
    return val

def insert_records_to_sqlite(records, table_name, db_file):
    if not records:
        print(f"[SQLite] No records to insert into `{table_name}`.")
        return

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    sample = records[0]
    columns = []
    for key, value in sample.items():
        col_type = "INTEGER" if isinstance(value, int) else "REAL" if isinstance(value, float) else "TEXT"
        columns.append(f"`{key}` {col_type}")
    cursor.execute(f"CREATE TABLE IF NOT EXISTS `{table_name}` ({', '.join(columns)});")

    keys = list(sample.keys())
    insert_sql = f"INSERT INTO `{table_name}` ({', '.join(f'`{k}`' for k in keys)}) VALUES ({', '.join('?' * len(keys))})"
    values = [tuple(sanitize_value(rec.get(k, None)) for k in keys) for rec in records]

    cursor.executemany(insert_sql, values)
    conn.commit()
    conn.close()
    print(f"[SQLite] Inserted {len(records)} records into `{table_name}` in `{db_file}`.")

def get_access_token():
    response = requests.post(
        f"{BASE_URL}/token",
        data={'grant_type': 'password', 'username': USERNAME, 'password': PASSWORD},
        headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0"}
    )
    response.raise_for_status()
    return response.json().get('access_token')

def fetch_records(token, path, data_key, orderby=True):
    url = f"{BASE_URL}{path}"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "Mozilla/5.0"
    }
    params = {"$top": 100}
    if orderby:
        params["$orderby"] = "CreatedDateTime desc"

    try:
        response = requests.get(url, headers=headers, params=params, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get(data_key, [])
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"[ERROR] Fetch failed for `{path}`: {e}")

def extract_subfield(records, field_name, parent_id_key):
    sub_data = []
    skipped = 0

    for record in records:
        parent_id = record.get(parent_id_key)
        items = record.get(field_name)

        if isinstance(items, list):
            for item in items:
                item[parent_id_key] = parent_id
                sub_data.append(item)
        elif isinstance(items, dict):
            items[parent_id_key] = parent_id
            sub_data.append(items)
        elif items is None:
            skipped += 1
        else:
            print(f"[WARN] Unexpected type for `{field_name}`: {type(items)}")

    print(f"📦 Extracted {len(sub_data)} records from `{field_name}`. Skipped {skipped} empty.")
    return sub_data

def show_database_info():
    print("📊 Database Summary:")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"📁 Database file: {DB_FILE}")
    print(f"📋 Total tables: {len(tables)}")
    print("\n📋 Tables in database:")
    
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT COUNT(*) FROM `{table_name}`")
        count = cursor.fetchone()[0]
        print(f"  • {table_name}: {count} records")
    
    print("\n🔍 Example queries you can run:")
    print("""
    -- View all tables
    SELECT name FROM sqlite_master WHERE type='table';
    
    -- Sample data from main tables
    SELECT * FROM Products LIMIT 5;
    SELECT * FROM Materials LIMIT 5;
    SELECT * FROM PurchaseOrder LIMIT 5;
    
    -- Sample data from related tables
    SELECT * FROM Products_ActivityResults LIMIT 5;
    SELECT * FROM Materials_PrimaryUserDefinedFieldValue LIMIT 5;
    """)
    
    conn.close()
    print("✅ Database summary completed.\n")

def main():
    # Clean old DB file
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    try:
        print("🔐 Getting Vision PLM access token...")
        token = get_access_token()
        print("✅ Token acquired.\n")

        for name, config in ENDPOINT_CONFIGS.items():
            print(f"📡 Fetching: {name}")
            try:
                records = fetch_records(token, config["path"], config["data_key"], config["orderby"])

                if records:
                    insert_records_to_sqlite(records, name, DB_FILE)

                    # Determine the appropriate ID field based on endpoint name
                    id_field = "ID"  # Default ID field
                    if name == "PurchaseOrderLines":
                        id_field = "PurchaseOrderLineID"
                    elif name == "BillOfMaterialItems":
                        id_field = "BillOfMaterialItemID"
                    elif name == "MaterialSupplierProfiles":
                        id_field = "MaterialSupplierProfileID"
                    elif name == "ProductSupplierProfiles":
                        id_field = "ProductSupplierProfileID"
                    elif name == "ProductBillOfMaterials":
                        id_field = "ProductBillOfMaterialID"

                    activity = extract_subfield(records, "ActivityResults", id_field)
                    insert_records_to_sqlite(activity, f"{name}_ActivityResults", DB_FILE)

                    primary = extract_subfield(records, "PrimaryUserDefinedFieldValue", id_field)
                    insert_records_to_sqlite(primary, f"{name}_PrimaryUserDefinedFieldValue", DB_FILE)
                else:
                    print(f"⚠ No data returned for `{name}`")

            except Exception as e:
                print(f"[ERROR] {name}: {e}")

        print("\n✅ Finished all endpoint processing.")
        show_database_info()

    except Exception as e:
        print(f"[FATAL ERROR] {e}")

if __name__ == "__main__":
    main()
