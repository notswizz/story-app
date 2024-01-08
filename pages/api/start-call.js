export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extracting the task details from the request body
    const { phoneNumber, task: taskString } = req.body;

    // Logging the received task string to console
    console.log("Received Task String:", taskString);

    // Parsing the task string back into an object
    let taskObj;
    try {
      taskObj = JSON.parse(taskString);
      console.log("Parsed Task Object:", taskObj);
    } catch (e) {
      console.error("Error parsing task string:", e);
      return res.status(400).json({ error: "Invalid task format" });
    }

    const options = {
      method: 'POST',
      headers: {
        'authorization': process.env.NEXT_PUBLIC_BLAND_AI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        task: taskObj.prompt, // Use the prompt from the parsed task object
        from: '+14048827923', // Verify if this should be a dynamic value
        reduce_latency: false,
        voice_id: 8,
        wait_for_greeting: true,
        record: true
        // Add other fields as required
      })
    };

    try {
      const apiResponse = await fetch('https://api.bland.ai/v1/calls', options);
      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
      const data = await apiResponse.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error making the call:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
