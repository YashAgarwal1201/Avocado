<template>
  <div>
    <Drawer
        v-model:visible="navbarStore.isFeedbackMenuOpen"
        :dismissable="true"
        :modal="true"
        class="!w-full !max-w-[768px] h-full rounded-none md:rounded-l-3xl"
        position="right"
        v-on:hide="() => navbarStore.closeFeedbackMenu()"

    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-xl sm:text-2xl font-heading text-yellow-600 dark:text-yellow-500">Give Feedback</h3>


        </div>
      </template>
      <div class="flex flex-col h-full">

        <div class="w-full rounded-3xl bg-white dark:bg-stone-700 p-4">
          <Form
              :validation-schema="schema"
              class="flex flex-col"
              @submit="onSubmit"
          >
            <div class="custom-panel-header rounded-xl p-2">
              <div class="flex items-center justify-between">
                <label class="block font-medium mb-1 font-heading" for="name">Name</label>
                <ErrorMessage class="text-red-500 text-sm mt-1" name="name"/>
              </div>

              <Field
                  id="name"
                  class="w-full p-inputtext border !border-stone-300 dark:!border-stone-600 !rounded-lg"
                  name="name"
                  type="text"
              />
            </div>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <div class="custom-panel-header rounded-xl p-2">
              <div class="flex items-center justify-between">
                <label class="block font-medium mb-1 font-heading" for="email">Email</label>
                <ErrorMessage class="text-red-500 text-sm mt-1" name="email"/>
              </div>

              <Field
                  id="email"
                  class="w-full p-inputtext  border !border-stone-300 dark:!border-stone-600 !rounded-lg"
                  name="email"
                  type="email"
              />
            </div>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <div class="custom-panel-header rounded-xl p-2">
              <div class="flex items-center justify-between">
                <label class="block font-medium mb-1 font-heading" for="message"
                >Message</label
                >
                <ErrorMessage
                    class="text-red-500 text-sm mt-1"
                    name="message"
                />
              </div>

              <Field
                  id="message"
                  as="textarea"
                  class="w-full p-inputtextarea  border !border-stone-300 dark:!border-stone-600 !rounded-lg resize-none"
                  name="message"
                  rows="5"
              />
            </div>


            <div aria-hidden="true" class="sr-only">
              <Field
                  id="website"
                  autocomplete="off"
                  name="website"
                  tabindex="-1"
                  type="text"
              />
            </div>

            <div class="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-stone-300 dark:bg-stone-600"></div>

            <div class="flex items-center gap-x-5">
              <Button
                  :outlined="true"
                  class="border !border-lime-500 dark:!border-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 !text-lime-500 dark:!text-lime-500 hover:!text-black !rounded-lg px-4 py-2 flex-grow-1 flex items-center gap-x-2 text-sm sm:text-base lg:text-lg"
                  type="reset"
                  @click="closeFeedbackDialogHandle"
              >
                <X :size="16"/>
                <span>Cancel</span>
              </Button>
              <Button
                  class="!border-none !rounded-lg !bg-lime-500 dark:!bg-lime-400 hover:!bg-lime-600 dark:hover:!bg-lime-500 px-4 py-2 flex-grow-1 flex items-center gap-x-2 text-sm sm:text-base lg:text-lg"
                  type="submit"
              >
                <Send :size="16"/>
                <span>Submit</span>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import {Send, X} from "lucide-vue-next";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import {ErrorMessage, Field, Form, useForm} from "vee-validate";
import * as yup from "yup";
import {ref} from "vue";
import {useNavbarStore} from "../../pinia/navbarStore.ts";
import {BASE_API_LINK} from "../../constants/BaseConstants.ts";
import toastHandler from "../../composables/toastHandler.ts";

const navbarStore = useNavbarStore();
const {showToast} = toastHandler();
const loading = ref(false);

const closeFeedbackDialogHandle = () => {
  navbarStore.isFeedbackMenuOpen = false;
  navbarStore.isSideMenuOpen = true;
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Please enter a valid email"),
  message: yup.string().required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(250, "Message can be at most 250 characters long"),
  website: yup.string().nullable(),
});

const openEmailFallback = ({name, email, message}: { name: string, email: string, message: string }) => {
  const subject = encodeURIComponent("Feedback Form Submission");
  const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:legoyashx@outlook.com?subject=${subject}&body=${body}`;
};

// Sanitizer
const sanitizeData = (values: any) => ({
  name: values.name.trim(),
  email: values.email.trim(),
  message: values.message.trim(),
});

// Vee-Validate reset function
const {resetForm} = useForm();

const onSubmit = async (values: any) => {
  // Bot check placeholder (if you add a hidden field later)
  if (values.website) {
    console.warn("Bot detected, You filthy bot!");
    showToast("warn", "Warning", "Bot detected. Form submission blocked.");
    return;
  }
  const cleanedValues = sanitizeData(values);
  try {
    loading.value = true;
    const response = await fetch(
        `${BASE_API_LINK}/api-services/avocado/contact-form-data`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(cleanedValues),
        }
    );

    if (response.ok) {
      showToast("success", "Success", "Form submitted");
      navbarStore.isFeedbackMenuOpen = false;
      resetForm(); // clear form after submit
    } else {
      console.error("Error:", response.statusText || "Unknown error");
      showToast("error", "Error", "Failed to submit form. Opening email app...");
      openEmailFallback(cleanedValues)
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("error", "Error", "An error occurred. Opening email app...");
    openEmailFallback(cleanedValues)
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* PrimeVue input style tweaks if needed */
.p-inputtext,
.p-inputtextarea {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
}
</style>
