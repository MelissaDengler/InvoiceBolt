export function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'overdue':
      return 'destructive'
    case 'draft':
      return 'secondary'
    default:
      return 'default'
  }
} 