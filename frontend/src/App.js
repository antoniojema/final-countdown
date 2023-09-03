// Time in Spain: 5:00 (UTC + 2)
const initDate = new Date(2023, 7, 30, 3, 0)
// Time in Orlando when arriving: 19:00 (UTC - 3 due to daylight savings)
const finishDate = new Date(2023, 11, 1, 22, 0)

export default function TotalPercentage() {

  const passedPercentage = (new Date().getTime() - initDate.getTime())/(finishDate.getTime() - initDate.getTime()) * 100
  return (
    <div>
      <h1>Total percentage passed</h1>
      <div>{passedPercentage.toFixed(4)}%</div>
    </div>
  )
}
