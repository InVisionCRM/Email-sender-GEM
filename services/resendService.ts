export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    console.log('Sending email via API...');
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      throw new Error(`Invalid response from server: ${responseText}`);
    }

    if (!response.ok) {
      console.error('Email sending failed:', responseData);
      throw new Error(responseData.error || responseData.details || `HTTP ${response.status}`);
    }

    console.log('Email sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 