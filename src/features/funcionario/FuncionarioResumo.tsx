import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./FuncionarioResumo.css";

export function FuncionarioResumo() {
    return (
        <div className="resumo-card">
            <div className="resumo-card__info">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                suscipit suscipit porttitor. Suspendisse ex lorem, rhoncus nec
                ante eu, venenatis aliquam turpis. Nulla facilisi. Curabitur nec
                mattis dolor. Nulla finibus bibendum ligula tempus vehicula. Ut
                at tristique libero, nec efficitur dui. Aliquam erat volutpat.
                Fusce quam sem, tempus nec justo eget, luctus scelerisque velit.
                Nam sollicitudin purus urna, vitae ornare neque tincidunt vel.
                Proin ac lacinia erat, et commodo felis. Phasellus tempor tellus
                eu vulputate tempus.
            </div>

            <div className="resumo-card__photo">
                <Avatar
                    shape="square"
                    size={142}
                    icon={<UserOutlined />}
                />
            </div>
        </div>
    );
}
