export const sendOtpOnWhatsapp = async (otp: number, phone: number) => {
  const template = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: phone,
    type: 'template',
    template: {
      name: 'otp_verification',
      language: {
        code: 'en',
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: otp,
            },
          ],
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            {
              type: 'text',
              text: otp,
            },
          ],
        },
      ],
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${process.env.Meta_WA_SenderPhoneNumberId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en_US',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.Meta_WA_accessToken}`,
      },
    }
  );
};
