import { Transcript } from '@/types'
import { inRange } from 'utils'

// Given a `transcript` and a `timecode`, binary search for the line in
// transcript that matches the timecode. If timecode is between two lines or
// past the end of the transcript, returns the nearest previous line.
const searchForLine = (
  transcript: Transcript,
  timecode: number,
  lo = 0,
  hi = transcript.length - 1
): number | null => {
  if (lo > hi) {
    // not found
    return null
  }
  const mid = Math.floor((lo+hi) / 2)
  if (
    !transcript[mid+1] ||
    inRange(timecode, transcript[mid].start, transcript[mid+1].start)
  ) {
    // Match: there is no next line (we're at the end of the transcript), or
    // timecode is in current midpoint's range
    return mid
  }
  if (timecode < transcript[mid].start) {
    // timecode is before current midpoint: recurse on first half
    return searchForLine(
      transcript,
      timecode,
      lo,
      mid - 1
    )
  } else {
    // timecode is after current midpoint: recurse on second half
    return searchForLine(
      transcript,
      timecode,
      mid + 1,
      hi
    )
  }
}

// Given a transcript, current timecode, and the current line number, return
// the updated current line of the trnascript. When called while media is
// playing (`timeUpdate` event), this will usually be either the current line
// or the line immediately following the current line, so these code paths are
// optimized.
export const getCurrentLine = (
  transcript: Transcript,
  timecode: number,
  currentLineNum: number
) => {
  const currentLine = transcript[currentLineNum]
  const nextLine = transcript[currentLineNum+1]
  const twoLinesAhead = transcript[currentLineNum+2]
  const lastLine = transcript[transcript.length - 1]

  if (timecode > lastLine?.start) {
    // timecode is within or beyond the last line
    return transcript.length - 1
  }
  if (inRange(timecode, currentLine.start, nextLine?.start)) {
    // timecode is within the current line
    return currentLineNum
  }
  if (inRange(timecode, nextLine?.start, twoLinesAhead?.start)) {
    // timecode is within the next line
    return currentLineNum + 1
  }
  // timecode is somewhere else (possibly due to user seek), so binary search
  // for the current line
  return searchForLine(transcript, timecode)
}