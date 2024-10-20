import React from "react";
import ExtLink from "~/components/ExtLink";
import type { LinkProps } from "@remix-run/react";
import { Link, useNavigation } from "@remix-run/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { twMerge } from "tailwind-merge";
import { cva, cx } from "~/cva.config";

const sizes = {
  XS: "h-[26.5px] px-2 text-xs",
  SM: "h-[36px] px-3 text-[13px]",
  MD: "h-[40px] px-3.5 text-sm",
  LG: "h-[48px] px-4 text-base",
  XL: "h-[56px] px-5 text-base",
};

const themes = {
  primary:
    "bg-blue-700 hover:bg-blue-800 active:bg-blue-900 border border-blue-700/80 text-white shadow",
  danger:
    "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-700 hover:border-red-800 group-hover:border-red-800 shadow-sm group-focus:ring-red-700 shadow-red-200/80",
  light:
    "text-black bg-white group-hover:bg-blue-50/80 group-active:bg-blue-100/60 border-slate-800/30 shadow group-disabled:group-hover:bg-white",
  lightDanger:
    "text-black bg-white group-hover:bg-red-50/80 group-active:bg-red-100/60 text-black border-red-400/60 shadow-sm group-focus:ring-red-700",
  blank:
    "text-black bg-white/0 group-hover:bg-white active:bg-slate-100/80 text-black border-transparent group-hover:border-slate-800/30 hover:shadow",
};

const btnVariants = cva({
  base: "outline-none font-display text-center font-semibold justify-center items-center duration-75 shrink-0 transition-colors leading-tight border rounded-md select-none group-focus:outline-none group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-blue-700 group-disabled:opacity-60 group-disabled:pointer-events-none",
  variants: {
    size: sizes,
    theme: themes,
  },
});

const iconVariants = cva({
  variants: {
    size: {
      XS: "h-3",
      SM: "h-4",
      MD: "h-5",
      LG: "h-6",
      XL: "h-6",
    },
    theme: {
      primary: "text-white",
      danger: "text-white",
      light: "text-slate-700",
      lightDanger: "text-slate-700",
      blank: "text-slate-700",
    },
  },
});

type ButtonContentPropsType = {
  text?: string | React.ReactNode;
  LeadingIcon?: React.FC<{ className: string | undefined }>;
  TrailingIcon?: React.FC<{ className: string | undefined }>;
  fullWidth?: boolean;
  className?: string;
  textAlign?: "left" | "center" | "right";
  size: keyof typeof sizes;
  theme: keyof typeof themes;
  loading?: boolean;
};

function ButtonContent(props: ButtonContentPropsType) {
  const { text, LeadingIcon, TrailingIcon, fullWidth, className, textAlign, loading } =
    props;

  // Based on the size prop, we'll use the corresponding variant classnames
  const iconClassName = iconVariants(props);
  const btnClassName = btnVariants(props);
  return (
    <div className={cx(className, fullWidth ? "flex" : "inline-flex", btnClassName)}>
      <div
        className={cx(
          "flex w-full min-w-0 items-center gap-x-1.5 text-center",
          textAlign === "left" ? "!text-left" : "",
          textAlign === "center" ? "!text-center" : "",
          textAlign === "right" ? "!text-right" : "",
        )}
      >
        {loading ? (
          <div>
            <LoadingSpinner className={cx(iconClassName, "animate-spin")} />
          </div>
        ) : (
          LeadingIcon && (
            <LeadingIcon className={cx(iconClassName, "shrink-0 justify-start")} />
          )
        )}

        {text && typeof text === "string" ? (
          <span className="relative w-full truncate">{text}</span>
        ) : (
          text
        )}

        {TrailingIcon && (
          <TrailingIcon className={cx(iconClassName, "shrink-0 justify-end")} />
        )}
      </div>
    </div>
  );
}

type ButtonPropsType = Pick<
  JSX.IntrinsicElements["button"],
  "type" | "disabled" | "onClick" | "name" | "value" | "formNoValidate" | "onMouseLeave"
> &
  React.ComponentProps<typeof ButtonContent> & { fetcher?: any };
export const Button = ({
  type,
  disabled,
  onClick,
  formNoValidate,
  loading,
  fetcher,
  ...props
}: ButtonPropsType) => {
  const classes = cx(
    "group outline-none",
    props.fullWidth ? "w-full" : "",
    loading ? "pointer-events-none" : "",
  );
  const navigation = useNavigation();
  let loader = fetcher ? fetcher : navigation;
  return (
    <button
      formNoValidate={formNoValidate}
      className={classes}
      type={type}
      disabled={disabled}
      onClick={onClick}
      name={props.name}
      value={props.value}
    >
      <ButtonContent
        {...props}
        loading={
          loading ??
          (type === "submit" &&
            (loader.state === "submitting" || loader.state === "loading") &&
            loader.formMethod?.toLowerCase() === "post")
        }
      />
    </button>
  );
};

type LinkPropsType = Pick<LinkProps, "to"> &
  React.ComponentProps<typeof ButtonContent> & { disabled?: boolean };
export const LinkButton = ({ to, ...props }: LinkPropsType) => {
  const classes = twMerge(
    cx(
      "group outline-none",
      props.disabled ? "pointer-events-none !opacity-70" : "",
      props.fullWidth ? "w-full" : "",
      props.loading ? "pointer-events-none" : "",
      props.className,
    ),
  );

  if (to.toString().startsWith("http")) {
    return (
      <ExtLink href={to.toString()} className={classes}>
        <ButtonContent {...props} />
      </ExtLink>
    );
  } else {
    return (
      <Link to={to} className={classes}>
        <ButtonContent {...props} />
      </Link>
    );
  }
};

type LabelPropsType = Pick<HTMLLabelElement, "htmlFor"> &
  React.ComponentProps<typeof ButtonContent> & { disabled?: boolean };
export const LabelButton = ({ htmlFor, ...props }: LabelPropsType) => {
  const classes = cx(
    "group outline-none block cursor-pointer",
    props.disabled ? "pointer-events-none !opacity-70" : "",
    props.fullWidth ? "w-full" : "",
    props.loading ? "pointer-events-none" : "",
    props.className,
  );

  return (
    <div>
      <label htmlFor={htmlFor} className={classes}>
        <ButtonContent {...props} />
      </label>
    </div>
  );
};
