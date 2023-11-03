import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Listing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 4000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setupLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setError("You should upload atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price should be less than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="border p-3 rounded-lg"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            id="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            className="border p-3 rounded-lg"
            id="address"
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking === true}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished === true}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer === true}
              />
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
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                id="regularPrice"
                min="4000"
                max="100000000"
                required
                type="number"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">(Rs / month)</span>
              </div>
            </div>
            {formData.offer ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(Rs / month)</span>
                </div>
              </div>
            ) : (
              ""
            )}
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

          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default Listing;
