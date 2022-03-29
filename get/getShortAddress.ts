export default function getShortAddress( address:string ) {
    const first6Char = address.substring(0, 5);
    const last4Char = address.substring(address.length - 4, address.length);
    return `${first6Char}...${last4Char}`;
}
