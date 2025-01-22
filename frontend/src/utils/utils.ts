
export function timeAgo(dateString: string): string {
  
  if(dateString == null) return "Never";

  const now = new Date();
  const pastDate = new Date(dateString);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  // console.log("Last indexed x seconds ago: ", seconds);

  if (Number.isNaN(seconds)) return "unknown";

  let interval: number;

  interval = Math.floor(seconds / 31536000); // years
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return `1 year ago`;

  interval = Math.floor(seconds / 2592000); // month
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return `1 month ago`;

  interval = Math.floor(seconds / 86400); // days
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return `1 day ago`;

  interval = Math.floor(seconds / 3600); // hours
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return `1 hour ago`;

  interval = Math.floor(seconds / 60); // minutes
  if (interval > 1) return `${interval} mins ago`;
  if (interval === 1) return `1 min ago`;

  return seconds < 10 ? "few seconds ago" : "Less than a minute ago";
}

