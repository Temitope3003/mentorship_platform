/**
 * One-shot script: resets all mentee progress so every mentee must click
 * "Start My Journey" again and begins at Week 1 under the new
 * submission-gated model.
 *
 * What it does:
 *   1. Deletes every WeeklySubmission row (clears all submitted-week history)
 *   2. Sets hasStarted=false, isPaused=false on every active mentee
 *   3. Clears pausedAt / pauseReason / totalPausedDays
 *   4. Leaves startDate alone (overwritten fresh when they click Start)
 *   5. Leaves hasReceivedCertificate, plan, liaisonNotes, domainTrack untouched
 *
 * Run from the backend directory:
 *   npx tsx src/scripts/resetMenteeProgress.ts
 */

import { prisma } from '../models/prisma'

async function main() {
  console.log('=== Mentee Progress Reset ===\n')

  const { count: subCount } = await prisma.weeklySubmission.deleteMany({})
  console.log(`✓ Deleted ${subCount} weekly submission records`)

  const { count: menteeCount } = await prisma.mentee.updateMany({
    data: {
      hasStarted: false,
      isPaused: false,
      pausedAt: null,
      pauseReason: null,
      totalPausedDays: 0,
    },
  })
  console.log(`✓ Reset ${menteeCount} mentees → hasStarted=false`)

  console.log('\nDone. All mentees will see "Start My Journey" on next login.')
}

main()
  .catch((err) => {
    console.error('Reset failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
