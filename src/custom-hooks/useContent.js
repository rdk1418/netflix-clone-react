import React, { useEffect, useState } from "react";

function useContent(target) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const apiUrl = `https://r4wxaculyqackjc6y7w555gena0zcylr.lambda-url.us-east-1.on.aws/${target}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming 'data' is an array of DynamoDB records
        const normalizedData = data.map((item) => ({
          id: item.id?.S,
          title: item.title?.S,
          description: item.description?.S,
          genre: item.genre?.S,
          maturity: item.maturity?.S,
          slug: item.slug?.S,
        }));
        setContent(normalizedData);
        console.log(normalizedData);
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
      });
  }, [target]);

  return { [target]: content };
}

export default useContent;
