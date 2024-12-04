export const getUser = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, {
    method: "GET",
  });

  if (res.ok) {
    const data = await res.json();

    return data.data;
  }
};
