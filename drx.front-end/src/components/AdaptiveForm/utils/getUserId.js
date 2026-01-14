export default function getUserId(index, sub, userList) {
  if (userList && userList[index]?.userId) {
    return userList[index]?.userId;
  }
  return index === 0 ? sub : undefined;
}
