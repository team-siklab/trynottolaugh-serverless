/**
 * Calculates the proportional size of a bounded face in an image,
 * as bounded by the Rekognition service.
 *
 * @param {object} face - A face object, as specified by the Rekognition service.
 */
exports.getFaceSize = ({ BoundingBox }) => {
  return BoundingBox.width * BoundingBox.height
}

/**
 * Sorts a list of faces detected in a Rekognition query according to the size of their faces,
 * sorted from largest to smallest.
 *
 * @param {object} facedetails - The FaceDetails object, as returned by the Rekognition service.
 */
exports.sortFaces = (faces) => {
  return faces.sort((a, b) => {
    // :: descending order
    return -(exports.getFaceSize(a) - exports.getFaceSize(b))
  })
}
