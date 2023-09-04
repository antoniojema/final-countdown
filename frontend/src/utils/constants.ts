// Time in Spain: 5:00 (UTC + 2)
export const initDate = new Date(Date.UTC(2023, 7, 30, 3, 0))
// Time in Orlando when arriving: 19:00 (UTC - 3 due to daylight savings)
export const finishDate = new Date(Date.UTC(2023, 11, 1, 22, 0))
// Total time in milliseconds from the previous dates
export const totalTime = finishDate.getTime() - initDate.getTime()

export const cities = {
  columbus: 'columbus',
  granada: 'granada',
  orlando: 'orlando'
}

export const pics = {
  [cities.columbus]: "https://media.istockphoto.com/id/1169151392/es/foto/columbus-ohio-ee-uu-horizonte-en-el-r%C3%ADo.jpg?s=612x612&w=0&k=20&c=xqsjuRnFuGxsuh8B0xp9JV0ZLxlowA3Yn2pu_X6bubc=",
  [cities.granada]: "https://escuelasierranevada.com/wp-content/uploads/2012/11/g_sierra_nevada6.jpg",
  [cities.orlando]: ""
}

export const UTCOffsets = {
  [cities.columbus]: {
    UTCSummerOffset: -4,
    summerToWinter: new Date(Date.UTC(2023, 11 - 1, 5, 6, 0)),
  },
  [cities.granada]: {
    UTCSummerOffset: 2,
    summerToWinter: new Date(Date.UTC(2023, 10 - 1, 29, 1, 0)),
  },
  [cities.orlando]: {
    UTCSummerOffset: -4,
    summerToWinter: new Date(Date.UTC(2023, 11 - 1, 5, 6, 0)),
  },
}
