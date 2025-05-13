import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

const filePath = path.resolve("../results/grouped_data.csv")
const fileContent = fs.readFileSync(filePath, "utf8").trim()

const rawData = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
}) as Record<string, string>[]
console.log(`${rawData.length} records loaded`)
console.log(rawData[0])

export type DataPoint = {
  deviceId: string
  hour: number
  floor: number
  description: string
  temperature: number
  humidity: number
  light: number
  motion: number
  co2: number
  battery: number
  soundAvg: number
  soundPeak: number
  soundAvgLinear: number
  soundPeakLinear: number
  moisture: number
  pressure: number
  location: {
    latitude: number
    longitude: number
  }
}

export const data: DataPoint[] = rawData
  .map((dp) => ({
    deviceId: dp.device_id,
    hour: Number(dp.hour),
    floor: Number(dp.floor),
    description: dp.desc,
    temperature: Number(dp.temperature),
    humidity: Number(dp.humidity),
    light: Number(dp.light),
    motion: Number(dp.motion),
    co2: Number(dp.co2),
    battery: Number(dp.battery),
    soundAvg:Number(dp.sound_avg),
    soundPeak: Number(dp.sound_peak),
    soundAvgLinear:Number(dp.sound_avg_linear),
    soundPeakLinear: Number(dp.sound_peak_linear),
    moisture: Number(dp.moisture),
    pressure: Number(dp.pressure),
    location: (() => {
      const coords = dp.location.split(", ")
      return { latitude: Number(coords[0]), longitude: Number(coords[1]) }
    })(),
  }))
  .toSorted((a, b) =>
    a.deviceId == b.deviceId ? a.hour - b.hour : a.deviceId.localeCompare(b.deviceId)
  )
