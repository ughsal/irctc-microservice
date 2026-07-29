import { GoogleLogin } from "@react-oauth/google";

type GoogleAuthButtonProps = {
  onSuccess: (credential: string) => void;
  onError?: () => void;
};

export default function GoogleAuthButton({
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  return (
    <GoogleLogin
      onSuccess={response => {
        if (response.credential) onSuccess(response.credential);
        else onError?.();
      }}
      onError={onError}
    />
  );
}
