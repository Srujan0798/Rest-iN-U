import re
import sys

def convert_schema(input_file, output_file):
    try:
        with open(input_file, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
        return

    # Change provider to sqlite
    content = re.sub(r'provider\s*=\s*"postgresql"', 'provider = "sqlite"', content)

    # SQLite doesn't support enums. We need to convert them to Strings.
    enums = re.findall(r'enum\s+(\w+)\s+\{([^}]+)\}', content)

    # Replace enum usages with String
    for enum_name, _ in enums:
        content = re.sub(r'\b' + enum_name + r'\b', 'String', content)

    # Remove the enum definitions
    content = re.sub(r'enum\s+\w+\s+\{[^}]+\}', '', content)

    # Fix default values that were using enum constants (e.g. @default(ACTIVE) -> @default("ACTIVE"))
    def replace_default(match):
        val = match.group(1)
        if val in ['now', 'uuid', 'cuid', 'autoincrement', 'dbgenerated', 'true', 'false']:
            return match.group(0)
        if '(' in val or val.isdigit():
            return match.group(0)
        return f'@default("{val}")'

    content = re.sub(r'@default\(([^")]+)\)', replace_default, content)

    # Remove @db attributes
    content = re.sub(r'@db\.Text', '', content)
    content = re.sub(r'@db\.Decimal\(\d+,\s*\d+\)', '', content)
    content = re.sub(r'@db\.Date', '', content)

    # Remove array types
    content = re.sub(r'String\[\]', 'String', content)
    content = re.sub(r'Int\[\]', 'String', content)
    content = re.sub(r'Json\[\]', 'String', content)

    # Replace Json with String
    content = re.sub(r'\bJson\?', 'String?', content)
    content = re.sub(r'\bJson\b', 'String', content)

    with open(output_file, 'w') as f:
        f.write(content)
    print(f"Successfully converted {input_file}")

if __name__ == "__main__":
    convert_schema('backend/prisma/schema.prisma', 'backend/prisma/schema.prisma')
