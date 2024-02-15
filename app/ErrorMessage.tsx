import styles from './ErrorMessage.module.scss';

type Props = {
  message: string;
};

export default function ErrorMessage(props: Props) {
  return <div className={styles.errorMessage}>{props.message}</div>;
}
