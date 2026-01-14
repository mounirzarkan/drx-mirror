export default function mapValidator(scData) {
    return {
        "apifield": scData.apiField?.targetItem?.name,
        "type": scData.type?.value,
        "key": scData.key?.value,
        "mask": scData.mask?.value,
        "message": scData.message?.targetItem?.field?.value
    };
}