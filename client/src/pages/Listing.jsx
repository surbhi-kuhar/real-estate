import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function Listing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setupLoading] = useState(false);

  console.log(formData);
  console.log(files);

  const handleUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setupLoading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setimageUploadError(false);
          setupLoading(false);
        })
        .catch((error) => {
          setimageUploadError("Image upload failed (2MB max per image)");
          setupLoading(false);
        });
    } else {
      setimageUploadError("You can upload only 6 images per listing");
      setupLoading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    return () => {
      const newURLs = formData.imageURLs.filter((url, i) => i !== index);
      setFormData({ ...formData, imageURLs: newURLs });
    };
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="border p-3 rounded-lg"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            id="description"
            placeholder="Description"
            required
          />
          <input
            className="border p-3 rounded-lg"
            id="address"
            placeholder="Address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 ">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                id="regularprice"
                min="1"
                max="10"
                required
                type="number"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">(Rs / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                id="discountprice"
                min="1"
                max="10"
                type="number"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">(Rs / month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 mx-3 ">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError ? imageUploadError : ""}
          </p>

          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="image"
                  className="w-20 h-20 object-contain rounded-lg"
                />

                <button
                  type="button"
                  className="p-3 text-red-700 rounded-lg hover:opacity-75"
                  onClick={handleDeleteImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default Listing;
