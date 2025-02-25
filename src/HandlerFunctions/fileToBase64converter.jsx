export const fileToBase64converter = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove "data:<mime-type>;base64,"
        resolve(base64String);
      };
  
      reader.onerror = (error) => reject(error);
    });
  };