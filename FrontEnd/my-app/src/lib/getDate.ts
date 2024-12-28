export default function getDate(timestamp: number) {
  const myDate = new Date(timestamp * 1000);
  return myDate.toDateString();
}