import Head from "next/head"
import Layout from "../layout/layout"
import Link from "next/link"
import styles from "../styles/Form.module.css"
import Image from "next/image"
import { getSession } from "next-auth/react"
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"

export default function Login() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // credentials
  const onSubmit = async ({ email, password }: any) => {
    try {
      setError("")
      setLoading(true)
      const status: any = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
        callbackUrl: "/",
      })

      if (status.status === 401) {
        setError("Unauthorized")
      } else if (status.error) {
        setError(status.error)
      }

      router.push(status.url)
    } catch (error) {
      // console.log("error at login", error)
    } finally {
      setLoading(false)
    }
  }

  const warnGuestUser = () => {
    toast.error("Sorry! Only for test users. Please use Credentials")
  }

  const EVENTS_AUTH_CALLBACK =
    process.env.NODE_ENV !== "development"
      ? "https://events-all.vercel.app"
      : "http://localhost:3000"

  // google
  const handleGoogleSignin = async () => {
    process.env.NODE_ENV === "development"
      ? signIn("google", { callbackUrl: EVENTS_AUTH_CALLBACK })
      : warnGuestUser()
  }
  const handleGithubSignin = async () => {
    process.env.NODE_ENV === "development"
      ? signIn("github", { callbackUrl: EVENTS_AUTH_CALLBACK })
      : warnGuestUser()
  }
  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col w-full gap-10 mx-auto md:w-3/4 ">
        <div className="-mt-10 title md:-mt-0">
          <h1 className="text-2xl font-bold text-gray-800 md:py-4 md:text-4xl">
            Login
          </h1>
          <p className="hidden mx-auto text-gray-400 md:flex lg:w-3/4 2xl:inline">
            Be social, outgoing and fun, explore events and get whats fits you
            right.
          </p>
        </div>

        {/* form */}
        <form
          className="flex flex-col gap-y-5 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={`${error && "text-red-500"}`}>{error}</div>

          <div
            className={`${styles.inputgroup} ${
              errors.email && "border-red-500"
            }`}
          >
            <input
              className={styles.inputtext}
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <span className="flex items-center px-3 icon">
              <HiAtSymbol size={23} />
            </span>
          </div>

          <div
            className={`${styles.inputgroup} ${
              errors.password && "border-red-500"
            }`}
          >
            <input
              className={styles.inputtext}
              type={show ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <span
              className="icon flex cursor-pointer items-center px-3 hover:text-[#6366f1]"
              onClick={() => setShow((prevSt) => !prevSt)}
            >
              <HiFingerPrint size={23} />
            </span>
          </div>

          {/* login buttons */}
          <div className="input-button">
            <button className={styles.button} type="submit">
              {!loading ? "Login" : "Loading..."}
            </button>
          </div>
          <div className="input-button">
            <button
              className={styles.button_custom}
              type="button"
              onClick={handleGoogleSignin}
            >
              Sign In with Google{" "}
              <Image
                src={"/images/google.svg"}
                width="20"
                height={20}
                alt="google"
              />
            </button>
          </div>
          <div className="input-button">
            <button
              className={styles.button_custom}
              type="button"
              onClick={handleGithubSignin}
            >
              Sign In with Github{" "}
              <Image
                src={"/images/github.svg"}
                width="20"
                height={20}
                alt="github"
              />
            </button>
          </div>
        </form>

        {/* button */}
        <p className="text-center text-gray-400 ">
          Don`t have an account yet?{" "}
          <Link href={"/register"}>
            <a className="text-blue-700">Sign Up</a>
          </Link>
        </p>
      </section>
      <Toaster position="bottom-center" />
    </Layout>
  )
}

export async function getServerSideProps({ req }: any) {
  const session = await getSession({ req })

  if (session) return { redirect: { destination: "/", permanent: false } }

  return {
    props: { session },
  }
}
