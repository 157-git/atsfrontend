const FilterData = (dataList, searchTerm) => {
    const searchTermLower = searchTerm.toLowerCase();
    return dataList.filter((item) => {
      return (
        (item.date && item.date.toLowerCase().includes(searchTermLower)) ||
        (item.recruiterName &&
          item.recruiterName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateName &&
          item.candidateName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateEmail &&
          item.candidateEmail.toLowerCase().includes(searchTermLower)) ||
        (item.contactNumber &&
          item.contactNumber.toString().includes(searchTermLower)) ||
        (item.sourceName &&
          item.sourceName.toLowerCase().includes(searchTermLower)) ||
        (item.requirementCompany &&
          item.requirementCompany.toLowerCase().includes(searchTermLower)) ||
        (item.communicationRating &&
          item.communicationRating.toLowerCase().includes(searchTermLower)) ||
        (item.currentLocation &&
          item.currentLocation.toLowerCase().includes(searchTermLower)) ||
        (item.personalFeedback &&
          item.personalFeedback.toLowerCase().includes(searchTermLower)) ||
        (item.callingFeedback &&
          item.callingFeedback.toLowerCase().includes(searchTermLower)) ||
        (item.selectYesOrNo &&
          item.selectYesOrNo.toLowerCase().includes(searchTermLower)) ||
        (item.dateOfBirth &&
          item.dateOfBirth.toLowerCase().includes(searchTermLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchTermLower)) ||
        (item.qualification &&
          item.qualification.toLowerCase().includes(searchTermLower)) ||
        (item.jobDesignation &&
          item.jobDesignation.toLowerCase().includes(searchTermLower)) ||
        (item.requirementId &&
          item.requirementId.toString().toLowerCase().includes(searchTermLower)) ||
        (item.fullAddress &&
          item.fullAddress.toString().toLowerCase().includes(searchTermLower)) ||
        (item.experienceYear &&
          item.experienceYear.toString().toLowerCase().includes(searchTermLower)) ||
        (item.experienceMonth &&
          item.experienceMonth.toString().toLowerCase().includes(searchTermLower)) ||
        (item.relevantExperience &&
          item.relevantExperience.toString().toLowerCase().includes(searchTermLower)) ||
        (item.currentCTCLakh &&
          item.currentCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
        (item.currentCTCThousand &&
          item.currentCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
        (item.expectedCTCLakh &&
          item.expectedCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
        (item.expectedCTCThousand &&
          item.expectedCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
        (item.yearOfPassing &&
          item.yearOfPassing.toString().toLowerCase().includes(searchTermLower)) ||
        (item.extraCertification &&
          item.extraCertification.toLowerCase().includes(searchTermLower)) ||
        (item.holdingAnyOffer &&
          item.holdingAnyOffer.toString().toLowerCase().includes(searchTermLower)) ||
        (item.offerLetterMsg &&
          item.offerLetterMsg.toString().toLowerCase().includes(searchTermLower)) ||
        (item.noticePeriod &&
          item.noticePeriod.toString().toLowerCase().includes(searchTermLower)) ||
        (item.msgForTeamLeader &&
          item.msgForTeamLeader.toString().toLowerCase().includes(searchTermLower)) ||
        (item.availabilityForInterview &&
          item.availabilityForInterview
            .toString()
            .toLowerCase()
            .includes(searchTermLower)) ||
        (item.interviewTime &&
          item.interviewTime.toString().toLowerCase().includes(searchTermLower)) ||
        (item.finalStatus &&
          item.finalStatus.toString().toLowerCase().includes(searchTermLower)) ||
        (item.incentive &&
          item.incentive.toString().toLowerCase().includes(searchTermLower)) ||
        (item.candidateId &&
          item.candidateId.toString().toLowerCase().includes(searchTermLower)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchTermLower))
      );
    });
  };
  
  export default FilterData;
  