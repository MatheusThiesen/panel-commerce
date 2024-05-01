"use client";

interface GetFileFromUrlProps {
  url: string;
  name: string;
  defaultType: string;
}

export async function getFileFromUrl({
  url,
  name,
  defaultType,
}: GetFileFromUrlProps) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}
