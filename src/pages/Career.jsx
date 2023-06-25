import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCareer } from "../features/career/careerSlice";
import CardCareer from "../components/CardCareer";
import SearchBar from "../components/SearchBar";
import ButtonPrimary from "../components/ButtonPrimary";
import { AddRounded, EditRounded, SaveAltRounded } from "@mui/icons-material";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import ButtonOutline from "../components/ButtonOutline";
import FilterDropdown from "../components/FilterDropdown";
import { Alert, Skeleton, Snackbar } from "@mui/material";
import {
  addCareer,
  deleteCareerById,
  getAllCareers,
  getCareerById,
  updateCareerById,
} from "../api/career";
import Dropdown from "../components/Dropdown";
import ImageUploader from "../components/ImageUploader";
import ImageThumbnail from "../components/ImageUploader/ImageThumbnail";
import { TextEditor } from "../components/TextEditor";

const Career = () => {
  const careers = useSelector((store) => store.careerReducer.careers);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowToast, setIsShowToast] = useState({
    isOpen: false,
    variant: "info",
    duration: 5000,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [pictureCareer, setPictureCareer] = useState({});
  const [lastEducation, setLastEducation] = useState("");
  const [createOrUpdate, setCreateOrUpdate] = useState(0);
  const [selectedCareerId, setSelectedCareerId] = useState("");

  useEffect(() => {
    fetchAllCareers();
  }, []);

  const fetchAllCareers = async (params = {}) => {
    setIsLoading(true);

    try {
      const response = await getAllCareers(params);
      dispatch(updateCareer(response));
      setIsLoading(false);

      if (response.length < 1) {
        setNotFoundMsg("What you are looking for doesn't exist");
      }
    } catch (error) {
      setIsShowToast({
        ...isShowToast,
        isOpen: true,
        variant: "error",
        message: error.message,
      });
      setIsLoading(false);
    }

    setNotFoundMsg("What you are looking for doesn't exist");
  };

  const handleDeleteCareer = async (careerId) => {
    try {
      const response = await deleteCareerById(careerId);
      setIsShowToast({
        ...isShowToast,
        isOpen: true,
        variant: "success",
        message: response.message,
      });
      fetchAllCareers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchCareer = (event) => {
    const keyword = event.target.value;

    setSearchKeyword(keyword);
    fetchAllCareers({ search: keyword, sort_by: sortBy });
  };

  const handleSubmitCareer = async (values) => {
    console.log(values);
    const {
      jobPosition,
      company,
      location,
      salary,
      minExperience,
      workStatus,
      description,
      companyEmail,
    } = values;
    const formData = new FormData();
    formData.append("job_position", jobPosition);
    formData.append("company_name", company);
    formData.append("location", location);
    formData.append("salary", salary);
    formData.append("min_experience", minExperience);
    formData.append("last_education", lastEducation);
    formData.append("job_type", workStatus);
    formData.append("description", description);
    formData.append("company_email", companyEmail);
    formData.append("image", pictureCareer.file);

    if (createOrUpdate === 0) {
      try {
        const response = await addCareer(formData);
        setIsShowToast({
          ...isShowToast,
          isOpen: true,
          variant: "success",
          message: response.message,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await updateCareerById(selectedCareerId, formData);
        setIsShowToast({
          ...isShowToast,
          isOpen: true,
          variant: "success",
          message: response.message,
        });
      } catch (error) {
        console.log(error);
      }
    }
    setPictureCareer({});
    reset({
      jobPosition: "",
      company: "",
      location: "",
      salary: "",
      minExperience: "",
      lastEducation: "",
      workStatus: "",
      description: "",
      companyEmail: "",
    });
    handleShowModal(false);
    fetchAllCareers();
  };

  const handleCreateCareer = () => {
    handleShowModal(true);
    reset({
      jobPosition: "",
      company: "",
      location: "",
      salary: "",
      minExperience: "",
      lastEducation: "",
      workStatus: "",
      description: "",
      companyEmail: "",
    });
    setCreateOrUpdate(0);
    setPictureCareer({});
  };

  const handleEditCareer = async (careerId) => {
    handleShowModal(true);
    try {
      const career = await getCareerById(careerId);
      setPictureCareer({ ...pictureCareer, url: career.image });
      reset({
        jobPosition: career.job_position,
        company: career.company_name,
        location: career.location,
        minExperience: career.min_experience,
        workStatus: career.job_type,
        salary: career.salary,
        description: career.description,
        companyEmail: career.company_email,
      });
      setLastEducation(career.last_education);
      setCreateOrUpdate(1);
      setSelectedCareerId(careerId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowModal = (showModal) => {
    setIsShowModal(showModal);
  };

  const handleLastEducation = () => {
    const { lastEducation } = getValues();
    setLastEducation(lastEducation.value);
  };

  const handleChangeImage = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPictureCareer({ ...pictureCareer, file, url: objectUrl });
  };

  const handleSortBy = (event) => {
    const sortByValue = event.target.value;

    setSortBy(sortByValue);
    fetchAllCareers({ sort_by: sortByValue, search: searchKeyword });
  };

  return (
    <div>
      <Snackbar
        open={isShowToast.isOpen}
        autoHideDuration={isShowToast.duration}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setIsShowToast({ ...isShowToast, isOpen: false })}
      >
        <Alert
          onClose={() => setIsShowToast({ ...isShowToast, isOpen: false })}
          severity={isShowToast.variant}
          sx={{ width: "100%" }}
          className="capitalize"
        >
          {isShowToast.message}
        </Alert>
      </Snackbar>
      <Modal isOpen={isShowModal} type="addCareer" onClose={handleShowModal}>
        <Modal.Title title="New Career" />
        <form onSubmit={handleSubmit(handleSubmitCareer)}>
          <ImageUploader
            handleChange={handleChangeImage}
            icon={<EditRounded fontSize="12px" />}
            className="mb-5"
          >
            {!pictureCareer.url ? (
              <AddRounded />
            ) : (
              <ImageThumbnail src={pictureCareer.url} />
            )}
          </ImageUploader>
          <InputField
            label="Job Position"
            placeholder="Ex : Junior UI Designer"
            type="text"
            name="jobPosition"
            register={register}
            errors={errors}
          />
          <InputField
            label="Company"
            placeholder="Ex : PT Dinamika Indonesia"
            type="text"
            name="company"
            register={register}
            errors={errors}
          />
          <InputField
            label="Location"
            placeholder="Ex : Bali, Indonesia"
            type="text"
            name="location"
            register={register}
            errors={errors}
          />
          <InputField
            label="Min. Experience"
            placeholder="Ex : 5"
            type="text"
            name="minExperience"
            register={register}
            errors={errors}
            suffix={<span>Year</span>}
          />
          <InputField
            label="Work Status"
            placeholder="Ex : Fulltime"
            type="text"
            name="workStatus"
            register={register}
            errors={errors}
          />
          <Dropdown
            control={control}
            name={"lastEducation"}
            label={"Last Education"}
            placeholder={
              createOrUpdate === 0
                ? "Choose Your Last Education"
                : lastEducation
            }
            handleSelect={handleLastEducation}
          >
            <option value="High School" label="High School (SMP)" />
            <option
              value="Senior High School"
              label="Senior High School (SMA)"
            />
            <option value="Bachelor's degree" label="Bachelor's degree (S1)" />
            <option value="Master's degree" label="Master's degree (S2)" />
            <option value="Doctorate degree" label="Doctorate degree (S3)" />
          </Dropdown>
          <InputField
            label="Salary"
            placeholder="Ex : 3,500,000 ++"
            type="text"
            name="salary"
            register={register}
            errors={errors}
          />
          <TextEditor
            label={"Description"}
            name={"description"}
            register={register}
            control={control}
          />
          <InputField
            label="Company Email"
            placeholder="Ex : xcompanyx@example.com"
            type="text"
            name="companyEmail"
            register={register}
            errors={errors}
          />
          <div className="flex flex-col gap-4">
            <ButtonPrimary className="h-fit w-full px-3 py-3 flex items-center justify-center">
              {createOrUpdate === 0 ? (
                <AddRounded className="mr-1" style={{ fontSize: "1.125rem" }} />
              ) : (
                <SaveAltRounded
                  className="mr-1"
                  style={{ fontSize: "1.125rem" }}
                />
              )}
              <span className="text-[1rem]">
                {createOrUpdate === 0 ? "Add New Career" : "Save"}
              </span>
            </ButtonPrimary>
            <ButtonOutline
              className="h-fit w-full px-3 py-3 flex items-center justify-center"
              onClick={() => handleShowModal(false)}
            >
              <span className="text-[1rem]">
                {createOrUpdate === 0 ? "Not Now" : "Discard"}
              </span>
            </ButtonOutline>
          </div>
        </form>
      </Modal>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <SearchBar
            className="focus:outline-none w-72 text-neutralMediumLow"
            placeholder="Find something here ..."
            onChange={handleSearchCareer}
          />
          <ButtonPrimary
            className="h-fit w-auto flex items-center justify-center"
            onClick={handleCreateCareer}
          >
            <AddRounded className="mr-1" style={{ fontSize: "1.125rem" }} />
            <span className="text-[1rem]">New Career</span>
          </ButtonPrimary>
        </div>
        <div className="flex justify-end items-center gap-4">
          <span className="text-base">Sort By</span>
          <FilterDropdown value={sortBy} handleChange={handleSortBy} />
        </div>
        <div className="flex flex-col justify-center gap-4 min-h-[10rem]">
          {careers.length >= 1 ? (
            careers.map((career) =>
              isLoading ? (
                <Skeleton
                  key={career.id}
                  animation="wave"
                  variant="rounded"
                  width="100%"
                  height={150}
                />
              ) : (
                <CardCareer
                  key={career.id}
                  payloads={career}
                  handleEditCareer={handleEditCareer}
                  deleteCareer={handleDeleteCareer}
                />
              )
            )
          ) : (
            <h3 className="flex justify-center items-center font-semibold">
              {notFoundMsg}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Career;
