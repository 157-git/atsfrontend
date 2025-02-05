import { parseISO, intervalToDuration } from "date-fns";

export const calculateTotalTimeDifferenceAndAdditionForTimeDifferences = (data, operation) => {
  let totalMonths = 0, totalDays = 0, totalHours = 0, totalMinutes = 0, totalSeconds = 0;

  data.forEach((item) => {
    let start;
    let end;
    if (operation === "additionAddedToMail") {
      start = item.callingTacker;
      end = item.mailToClient;
    }
    if (operation === "additionMailToMailRes"){
        start = item.mailToClient;
        end = item.mailResponse;
    }
    if (operation === "additionMailResToInterviewProcess") {
        start = item.mailToClient;
        end = item.interviewRoundsList.length > 0 && item.interviewRoundsList[item.interviewRoundsList.length - 1].time ? item.interviewRoundsList[item.interviewRoundsList.length - 1].time : null ;
    }
    if (operation === "additionInterviewProcessToDocumentSent") {
        start = item.interviewRoundsList.length > 0 && item.interviewRoundsList[item.interviewRoundsList.length - 1].time ? item.interviewRoundsList[item.interviewRoundsList.length - 1].time : null ;
        end = item.sendingDocument;
    }
    if (operation === "additionDocumentSentToOfferLetterSendToCandidate") {
        start = item.sendingDocument;
        end = item.issuingLetter;
    }
    if (operation === "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate") {
        start = item.issuingLetter;
        end = item.letterResponseUpdating;
    }
    if (operation === "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate") {
        start = item.letterResponseUpdating;
        end = item.joiningProcess;
    }
    if (operation === "additionJoiningResponseFromCandidateToJoinDate") {
        start = item.joiningProcess;
        end = item.joinDate;
    }
    if (!start || !end) return;

    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);

      if (isNaN(startDate) || isNaN(endDate)) return;

      const duration = intervalToDuration({ start: startDate, end: endDate });


      totalMonths += duration.months || 0;
      totalDays += duration.days || 0;
      totalHours += duration.hours || 0;
      totalMinutes += duration.minutes || 0;
      totalSeconds += duration.seconds || 0;

    } catch (error) {
      console.error("Invalid date format:", start, end);
    }
  });

  // Convert excess seconds into minutes
  totalMinutes += Math.floor(totalSeconds / 60);
  totalSeconds = totalSeconds % 60;

  // Convert excess minutes into hours
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  // Convert excess hours into days
  totalDays += Math.floor(totalHours / 24);
  totalHours = totalHours % 24;

  // Convert excess days into months (assuming 30 days in a month)
  totalMonths += Math.floor(totalDays / 30);
  totalDays = totalDays % 30;

  return `${totalMonths} months, ${totalDays} days, ${totalHours} hours, ${totalMinutes} minutes, ${totalSeconds} seconds`;
};
