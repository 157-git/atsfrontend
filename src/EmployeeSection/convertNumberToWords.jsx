const numberToWords = (num) => {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
    
    return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
  };
  
  export const convertNumberToWords = (currentCTCLakh, currentCTCThousand) => {
    let lakhPart = parseInt(currentCTCLakh, 10);
    let thousandPart = parseInt(currentCTCThousand, 10);
  
    let words = "";
  
    if (lakhPart > 0) {
      words += numberToWords(lakhPart) + (lakhPart === 1 ? " Lakh" : " Lakhs");
    }
  
    if (thousandPart > 0) {
      if (words) words += " ";
      words += numberToWords(thousandPart) + (thousandPart === 1 ? " Thousand" : " Thousand");
    }
  
    return words || "Zero";
  };
  

  