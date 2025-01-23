interface Row {
  [key: string]: string;
}

interface Data {
  columns: string[];
  data: Row[];
  message: string;
}

export function generateMarkdownTable(data: Data): string {
  const { columns, data: rows } = data;

  // Create the header row
  let markdownTable = "| " + columns.join(" | ") + " |\n";

  // Create the separator row (using `-` under each column)
  markdownTable += "| " + columns.map(() => "---").join(" | ") + " |\n";

  // Create the data rows
  rows.forEach(row => {
    markdownTable += "| " + columns.map(col => row[col]).join(" | ") + " |\n";
  });

  return markdownTable;
}
export function generateHtmlTable(data: Data): string {
  const { columns, data: rows } = data;

  let htmlTable = `<table class="min-w-full table-auto border-separate border-spacing-0 border border-gray-300">\n`;

  htmlTable += "  <thead>\n    <tr class='bg-primary text-white'>\n"; // Updated to use primary color for header
  columns.forEach(col => {
    htmlTable += `      <th class="px-4 py-2 border border-gray-300 text-left text-sm font-medium">${col}</th>\n`;
  });
  htmlTable += "    </tr>\n  </thead>\n";

  htmlTable += "  <tbody class='text-white'>\n";
  rows.forEach(row => {
    htmlTable += "    <tr class='bg-secondary'>\n";
    columns.forEach(col => {
      htmlTable += `      <td class="px-4 py-2 border border-gray-300 text-sm">${row[col]}</td>\n`;
    });
    htmlTable += "    </tr>\n";
  });
  htmlTable += "  </tbody>\n";

  // End the table
  htmlTable += "</table>";

  return htmlTable;
}
