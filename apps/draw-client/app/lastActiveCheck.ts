const lastMessage = await prisma.chat.findFirst({
  where: { roomId: yourRoomId },
  orderBy: { createdAt: 'desc' },
});

// If there's no message, handle it gracefully:
if (!lastMessage) {
  console.log('No messages in this room yet.');
} else {
  const now = new Date();
  const createdAt = lastMessage.createdAt;

  const diffMs = now.getTime() - createdAt.getTime(); // difference in milliseconds

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  console.log(`Last active ${diffSeconds} seconds ago`);
  console.log(`or ${diffMinutes} minutes ago`);
  console.log(`or ${diffHours} hours ago`);
}
