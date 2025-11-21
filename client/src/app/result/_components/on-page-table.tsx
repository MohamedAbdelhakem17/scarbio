import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OnPageTable({ results }: { results: any[] }) {
  // Define columns dynamically instead of hardcoding them
  const columns = [
    { key: 'keyword', label: 'Keyword' },
    { key: 'url', label: 'URL', truncate: true },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'h1', label: 'H1' },
    { key: 'h2', label: 'H2' },
    { key: 'content', label: 'Content' },
    { key: 'alt_text', label: 'Alt Text' },
    { key: 'schema', label: 'Schema' },
    { key: 'traffic_opportunity', label: 'Potential Traffic' },
    { key: 'position', label: 'Position' },
  ];

  // Helper to mark red if value = "NO"
  const isNo = (value: string) => value === 'NO';
  const isYas = (value: string) => value === 'YES';

  return (
    <div className='overflow-x-auto'>
      <Table className='border-2 border-gray-300 text-zinc-200'>
        <TableHeader className='rounded-md'>
          <TableRow className='border-b-2 border-gray-500 bg-gray-300'>
            {/* First column (#) */}
            <TableHead className='border-r border-gray-400 text-center font-bold text-black'>
              #
            </TableHead>

            {/* Generate all other columns */}
            {columns.map(col => (
              <TableHead
                key={col.key}
                className='border-r border-gray-400 text-center font-bold text-black'
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.map((item, i) => (
            <TableRow
              key={i}
              className='border-b border-dashed border-gray-400'
            >
              {/* Row number */}
              <TableCell className='border-r border-dashed border-gray-400 text-center'>
                {i + 1}
              </TableCell>

              {/* Dynamic cells */}
              {columns.map(col => {
                const value = item[col.key];

                return (
                  <TableCell
                    key={col.key}
                    className={`border-r border-dashed border-gray-400 py-3 text-center font-bold ${isNo(value) ? 'font-semibold text-red-500' : isYas(value) ? 'font-semibold text-emerald-500' : ''} ${col.truncate ? 'max-w-xs truncate' : ''} `}
                  >
                    {col.key === 'url' && value ? (
                      <a
                        href={value}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 underline'
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
