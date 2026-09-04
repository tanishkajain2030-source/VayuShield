type Props = {
  message: string;
};

export default function WhatsAppButton({ message }: Props) {
  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
    >
      💬 Send Alert to WhatsApp
    </button>
  );
}
