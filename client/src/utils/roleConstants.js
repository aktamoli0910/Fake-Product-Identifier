export default function roleNumberFromString(roleString) {
  if (roleString === "manufacturer") return 1;
  else if (roleString === "distributor") return 2;
  else if (roleString === "retailer") return 3;
  else if (roleString === "consumer") return 4;
}
